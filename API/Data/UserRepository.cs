using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace API.Data
{
    public class UserRepository : IUserRepository
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public UserRepository(DataContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<MemberDto> GetMemberAsync(string username,bool isCurrentUser)
        {
            var users = _context.Users.Where(u => u.UserName == username).AsQueryable();

            if(isCurrentUser)
                users = users.IgnoreQueryFilters();

           return await users.ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
                                .SingleOrDefaultAsync();
        }

        // public async Task<IEnumerable<MemberDto>> GetMembersAsync()
        // {
        //     return await _context.Users
        //                     .ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
        //                     .ToListAsync();
        // }

          public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query =_context.Users.AsQueryable();
                query = query.Where(u => u.UserName != userParams.CurrentUserName);
                query = query.Where(g => g.Gender == userParams.Gender);

                var minDob = DateTime.Today.AddYears(-userParams.MaxAge - 1);
                var maxDob = DateTime.Today.AddYears(-userParams.MinAge); 

                query = query.Where(d => d.DateOfBirth >= minDob && d.DateOfBirth <= maxDob);

                query = userParams.OrderBy switch 
                {
                    "created" => query.OrderByDescending(u => u.Created),
                    _ => query.OrderByDescending(u => u.LastActive)
                };

            return await PagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(_mapper.ConfigurationProvider)
            .AsNoTracking(), 
            userParams.PageNumber, userParams.PageSize);
        }

        public async Task<AppUser> GetUserByIdAsync(int id)
        {
            return await _context.Users.FindAsync(id);
        }

        public async Task<AppUser> GetUserByUserNameAsync(string username)
        {
            return await _context.Users.Include(p => p.Photos)
            .SingleOrDefaultAsync(x => x.UserName == username.ToLower());
        }

        public async Task<string> GetUserGender(string username)
        {
            return await _context.Users
                 .Where(x => x.UserName == username)
                 .Select(x => x.Gender).FirstOrDefaultAsync();
        }

        public async Task<IEnumerable<AppUser>> GetUsersAsync()
        {
           return await _context.Users
           .Include(p => p.Photos)
           .ToListAsync();
        }

        public void Update(AppUser user)
        {
            _context.Entry(user).State = EntityState.Modified;
        }
    }
}