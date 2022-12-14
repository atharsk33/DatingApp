using API.DTOs;
using API.Entities;
using API.Extentions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MessagesController : BaseApiController
    {
        //private readonly IMessageRepository _unitOfWork.MessageRepository;
        //private readonly IUserRepository _unitOfWork.UserRepository;
        private readonly IMapper _mapper;
        private readonly IUnitOfWork _unitOfWork;

        public MessagesController(IUnitOfWork unitOfWork, IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto createMessageDto) 
        {
            var username = User.GetUserName();

            if(username == createMessageDto.RecipientUserName.ToLower()) 
            return BadRequest("You cannot send message to youselt");

            var sender = await _unitOfWork.UserRepository.GetUserByUserNameAsync(username);
            var receipient = await _unitOfWork.UserRepository.GetUserByUserNameAsync(createMessageDto.RecipientUserName);

            if(receipient == null) return NotFound();

            var message = new Message 
            {
                Sender = sender,
                Recipient = receipient,
                SenderUserName = sender.UserName,
                RecipientUserName = receipient.UserName,
                Content = createMessageDto.Content
            };

            _unitOfWork.MessageRepository.AddMessage(message);

            if(await _unitOfWork.Complete())
                return Ok(_mapper.Map<MessageDto>(message));

            return BadRequest("Failed to send message.");
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessagesForUser([FromQuery] MessageParams messageParams)
        {
            messageParams.Username = User.GetUserName();

            var messages = await _unitOfWork.MessageRepository.GetMessagesForUser(messageParams);

            Response.AddPaginationHeader(messages.CurrentPage, messages.PageSize, messages.TotalCount, messages.TotalPages);

            return Ok(messages);
        }

        [HttpGet("thread/{username}")]
        public async Task<ActionResult<IEnumerable<MessageDto>>> GetMessageThread(string username) 
        {
            var currentUsername = User.GetUserName();
            var thread = await _unitOfWork.MessageRepository.GetMessageThread(currentUsername, username);
            return Ok(thread);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteMessage(int id)
        {
            var username = User.GetUserName();
            var message = await _unitOfWork.MessageRepository.GetMessage(id);
            
            if(message == null) return NotFound();

            if(message.Sender.UserName != username && message.Recipient.UserName != username) 
                return Unauthorized();

            if(message.Sender.UserName == username) message.SenderDeleted = true;

            if(message.Recipient.UserName == username) message.RecipientDeleted = true;

            if(message.SenderDeleted && message.RecipientDeleted)
                _unitOfWork.MessageRepository.DeleteMessage(message);

            if(await _unitOfWork.Complete()) return Ok();

            return BadRequest("Problem deleting the message");

        }
    }
}