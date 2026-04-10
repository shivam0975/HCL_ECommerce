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
    public class OrdersController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public OrdersController(EcommerceDbContext context)
        {
            _context = context;
        }

        // GET: api/Orders
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderResponse>>> GetOrders()
        {
            var orders = await _context.Orders
                .AsNoTracking()
                .Select(o => ToResponse(o))
                .ToListAsync();

            return Ok(orders);
        }

        // GET: api/Orders/5
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderResponse>> GetOrder(int id)
        {
            var order = await _context.Orders.AsNoTracking().FirstOrDefaultAsync(o => o.OrderId == id);
            if (order == null)
            {
                return NotFound();
            }

            return Ok(ToResponse(order));
        }

        // PUT: api/Orders/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrder(int id, UpdateOrderRequest request)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            var userExists = await _context.Users.AnyAsync(u => u.UserId == request.UserId);
            if (!userExists)
            {
                return BadRequest(new { message = "Invalid user id." });
            }

            order.UserId = request.UserId;
            order.TotalAmount = request.TotalAmount;
            order.Status = request.Status.Trim();

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // POST: api/Orders
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<OrderResponse>> PostOrder(CreateOrderRequest request)
        {
            var userExists = await _context.Users.AnyAsync(u => u.UserId == request.UserId);
            if (!userExists)
            {
                return BadRequest(new { message = "Invalid user id." });
            }

            var order = new Order
            {
                UserId = request.UserId,
                TotalAmount = request.TotalAmount,
                Status = request.Status.Trim(),
                CreatedAt = DateTime.UtcNow
            };

            _context.Orders.Add(order);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrder), new { id = order.OrderId }, ToResponse(order));
        }

        // DELETE: api/Orders/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrder(int id)
        {
            var order = await _context.Orders.FindAsync(id);
            if (order == null)
            {
                return NotFound();
            }

            _context.Orders.Remove(order);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private static OrderResponse ToResponse(Order order) =>
            new(order.OrderId, order.UserId, order.TotalAmount, order.Status, order.CreatedAt);

        public record OrderResponse(int OrderId, int? UserId, decimal? TotalAmount, string? Status, DateTime? CreatedAt);

        public class CreateOrderRequest
        {
            [Range(1, int.MaxValue)]
            public int UserId { get; set; }

            [Range(0, 9999999999d)]
            public decimal TotalAmount { get; set; }

            [Required]
            [StringLength(50)]
            public string Status { get; set; } = string.Empty;
        }

        public class UpdateOrderRequest : CreateOrderRequest;
    }
}
