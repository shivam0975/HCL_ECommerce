using System.ComponentModel.DataAnnotations;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AddressController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public AddressController(EcommerceDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/Address
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AddressResponse>>> GetAddresses()
        {
            var addresses = await _context.Addresses
                .AsNoTracking()
                .Select(a => ToResponse(a))
                .ToListAsync();

            return Ok(addresses);
        }

        // ✅ GET: api/Address/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AddressResponse>> GetAddress(int id)
        {
            var address = await _context.Addresses.AsNoTracking().FirstOrDefaultAsync(a => a.AddressId == id);
            if (address == null)
            {
                return NotFound();
            }

            return Ok(ToResponse(address));
        }

        // ✅ POST: api/Address
        [HttpPost]
        public async Task<ActionResult<AddressResponse>> CreateAddress(CreateAddressRequest request)
        {
            if (!await _context.Users.AnyAsync(u => u.UserId == request.UserId))
            {
                return BadRequest(new { message = "Invalid user id." });
            }

            var address = new Address
            {
                UserId = request.UserId,
                Address1 = request.Address.Trim(),
                City = request.City.Trim(),
                State = request.State.Trim(),
                Pincode = request.Pincode.Trim()
            };

            _context.Addresses.Add(address);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAddress), new { id = address.AddressId }, ToResponse(address));
        }

        // ✅ PUT: api/Address/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAddress(int id, UpdateAddressRequest request)
        {
            var address = await _context.Addresses.FindAsync(id);
            if (address == null)
            {
                return NotFound();
            }

            if (!await _context.Users.AnyAsync(u => u.UserId == request.UserId))
            {
                return BadRequest(new { message = "Invalid user id." });
            }

            address.UserId = request.UserId;
            address.Address1 = request.Address.Trim();
            address.City = request.City.Trim();
            address.State = request.State.Trim();
            address.Pincode = request.Pincode.Trim();

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ✅ DELETE: api/Address/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAddress(int id)
        {
            var address = await _context.Addresses.FindAsync(id);
            if (address == null)
            {
                return NotFound();
            }

            _context.Addresses.Remove(address);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private static AddressResponse ToResponse(Address address) =>
            new(address.AddressId, address.UserId, address.Address1, address.City, address.State, address.Pincode);

        public record AddressResponse(int AddressId, int? UserId, string? Address, string? City, string? State, string? Pincode);

        public class CreateAddressRequest
        {
            [Range(1, int.MaxValue)]
            public int UserId { get; set; }

            [Required]
            public string Address { get; set; } = string.Empty;

            [Required]
            [StringLength(50)]
            public string City { get; set; } = string.Empty;

            [Required]
            [StringLength(50)]
            public string State { get; set; } = string.Empty;

            [Required]
            [StringLength(10)]
            public string Pincode { get; set; } = string.Empty;
        }

        public class UpdateAddressRequest : CreateAddressRequest;
    }
}
