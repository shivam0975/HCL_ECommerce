using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public UsersController(EcommerceDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserResponse>>> GetUsers()
        {
            var users = await _context.Users
                .AsNoTracking()
                .Select(u => ToResponse(u))
                .ToListAsync();

            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserResponse>> GetUser(int id)
        {
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(ToResponse(user));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UpdateUserRequest request)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            var normalizedEmail = request.Email.Trim().ToLowerInvariant();
            var emailExists = await _context.Users.AnyAsync(u => u.UserId != id && u.Email == normalizedEmail);
            if (emailExists)
            {
                return Conflict(new { message = "Email already exists." });
            }

            user.Name = request.Name.Trim();
            user.Email = normalizedEmail;
            user.Password = request.Password;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResponse>> Login(LoginRequest request)
        {
            var normalizedEmail = request.Email.Trim().ToLowerInvariant();
            var user = await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == normalizedEmail);

            if (user == null || user.Password != request.Password)
            {
                return Unauthorized(new { message = "Invalid email or password." });
            }

            // Simple token generation (in production, use JWT)
            var token = Guid.NewGuid().ToString();
            
            return Ok(new LoginResponse
            {
                UserId = user.UserId,
                Email = user.Email,
                Token = token,
                ExpiresIn = 3600
            });
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserResponse>> Register(CreateUserRequest request)
        {
            var normalizedEmail = request.Email.Trim().ToLowerInvariant();
            var emailExists = await _context.Users.AnyAsync(u => u.Email == normalizedEmail);
            if (emailExists)
            {
                return Conflict(new { message = "Email already exists." });
            }

            var user = new User
            {
                Name = request.Name.Trim(),
                Email = normalizedEmail,
                Password = request.Password,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var response = ToResponse(user);
            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, response);
        }

        [HttpPost]
        public async Task<ActionResult<UserResponse>> PostUser(CreateUserRequest request)
        {
            var normalizedEmail = request.Email.Trim().ToLowerInvariant();
            var emailExists = await _context.Users.AnyAsync(u => u.Email == normalizedEmail);
            if (emailExists)
            {
                return Conflict(new { message = "Email already exists." });
            }

            var user = new User
            {
                Name = request.Name.Trim(),
                Email = normalizedEmail,
                Password = request.Password,
                CreatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var response = ToResponse(user);
            return CreatedAtAction(nameof(GetUser), new { id = user.UserId }, response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private static UserResponse ToResponse(User user) =>
            new(user.UserId, user.Name, user.Email, user.CreatedAt);

        public record UserResponse(int UserId, string? Name, string? Email, DateTime? CreatedAt);

        public class LoginRequest
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; } = string.Empty;

            [Required]
            public string Password { get; set; } = string.Empty;
        }

        public class LoginResponse
        {
            public int UserId { get; set; }
            public string? Email { get; set; }
            public string Token { get; set; } = string.Empty;
            public int ExpiresIn { get; set; }
        }

        public class CreateUserRequest
        {
            [Required]
            [StringLength(100)]
            public string Name { get; set; } = string.Empty;

            [Required]
            [EmailAddress]
            [StringLength(100)]
            public string Email { get; set; } = string.Empty;

            [Required]
            [StringLength(100)]
            public string Password { get; set; } = string.Empty;
        }

        public class UpdateUserRequest : CreateUserRequest;
    }
}
