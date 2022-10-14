using API.DTOs;
using API.Entities;
using API.Extentions;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class LikesRepository : ILikesRepository
    {
        private readonly DataContext _context;

        public LikesRepository(DataContext context)
        {
            _context = context;
        }

        public async Task<UserLike> GetUserLike(int sourceUserId, int likedUserId)
        {
            return await _context.Likes.FindAsync(sourceUserId, likedUserId);
        }

         public async Task<PagedList<LikeDto>> GetUserLikes(LikesParam param)
        {
            var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
            var likes = _context.Likes.AsQueryable();

            if(param.Predicate == "liked")
            {
                likes = likes.Where(like => like.SourceUserId == param.UserId);
                users = likes.Select(like => like.LikedUser);
            }
            
            if(param.Predicate == "likedBy")
            {
                likes = likes.Where(like => like.LikedUserId == param.UserId);
                users = likes.Select(like => like.SourceUser);
            }

            var likedUsers = users.Select(user => new LikeDto 
            {
                UserName = user.UserName,
                KnownAs = user.KnownAs,
                Age = user.DateOfBirth.CalculateAge(),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
                City = user.City,
                Id = user.Id
            });
             
             return await PagedList<LikeDto>.CreateAsync(likedUsers, param.PageNumber, param.PageSize);
        }


        public async Task<AppUser> GetUserWithLikes(int UserId)
        {
            return await _context.Users
                        .Include(x => x.LikedUsers)
                        .FirstOrDefaultAsync(u => u.Id == UserId);
        }

        
        // public async Task<IEnumerable<LikeDto>> GetUserLikes(string predicate, int userId)
        // {
        //     var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
        //     var likes = _context.Likes.AsQueryable();

        //     if(predicate == "liked")
        //     {
        //         likes = likes.Where(like => like.SourceUserId == userId);
        //         users = likes.Select(like => like.LikedUser);
        //     }
            
        //     if(predicate == "likedBy")
        //     {
        //         likes = likes.Where(like => like.LikedUserId == userId);
        //         users = likes.Select(like => like.SourceUser);
        //     }

        //     return await users.Select(user => new LikeDto 
        //     {
        //         UserName = user.UserName,
        //         KnownAs = user.KnownAs,
        //         Age = user.DateOfBirth.CalculateAge(),
        //         PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain).Url,
        //         City = user.City,
        //         Id = user.Id
        //     }).ToListAsync();
             
        // }
    }
}