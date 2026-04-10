using System.ComponentModel.DataAnnotations;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderItemsController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public OrderItemsController(EcommerceDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderItemResponse>>> GetOrderItems()
        {
            var orderItems = await _context.OrderItems
                .AsNoTracking()
                .Select(oi => ToResponse(oi))
                .ToListAsync();

            return Ok(orderItems);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderItemResponse>> GetOrderItem(int id)
        {
            var orderItem = await _context.OrderItems.AsNoTracking().FirstOrDefaultAsync(oi => oi.OrderItemId == id);
            if (orderItem == null)
            {
                return NotFound();
            }

            return Ok(ToResponse(orderItem));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutOrderItem(int id, UpdateOrderItemRequest request)
        {
            var orderItem = await _context.OrderItems.FindAsync(id);
            if (orderItem == null)
            {
                return NotFound();
            }

            if (!await _context.Orders.AnyAsync(o => o.OrderId == request.OrderId))
            {
                return BadRequest(new { message = "Invalid order id." });
            }

            if (!await _context.Products.AnyAsync(p => p.ProductId == request.ProductId))
            {
                return BadRequest(new { message = "Invalid product id." });
            }

            orderItem.OrderId = request.OrderId;
            orderItem.ProductId = request.ProductId;
            orderItem.Quantity = request.Quantity;
            orderItem.Price = request.Price;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<OrderItemResponse>> PostOrderItem(CreateOrderItemRequest request)
        {
            if (!await _context.Orders.AnyAsync(o => o.OrderId == request.OrderId))
            {
                return BadRequest(new { message = "Invalid order id." });
            }

            if (!await _context.Products.AnyAsync(p => p.ProductId == request.ProductId))
            {
                return BadRequest(new { message = "Invalid product id." });
            }

            var orderItem = new OrderItem
            {
                OrderId = request.OrderId,
                ProductId = request.ProductId,
                Quantity = request.Quantity,
                Price = request.Price
            };

            _context.OrderItems.Add(orderItem);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetOrderItem), new { id = orderItem.OrderItemId }, ToResponse(orderItem));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOrderItem(int id)
        {
            var orderItem = await _context.OrderItems.FindAsync(id);
            if (orderItem == null)
            {
                return NotFound();
            }

            _context.OrderItems.Remove(orderItem);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private static OrderItemResponse ToResponse(OrderItem orderItem) =>
            new(orderItem.OrderItemId, orderItem.OrderId, orderItem.ProductId, orderItem.Quantity, orderItem.Price);

        public record OrderItemResponse(int OrderItemId, int? OrderId, int? ProductId, int? Quantity, decimal? Price);

        public class CreateOrderItemRequest
        {
            [Range(1, int.MaxValue)]
            public int OrderId { get; set; }

            [Range(1, int.MaxValue)]
            public int ProductId { get; set; }

            [Range(1, int.MaxValue)]
            public int Quantity { get; set; }

            [Range(0, 9999999999d)]
            public decimal Price { get; set; }
        }

        public class UpdateOrderItemRequest : CreateOrderItemRequest;
    }
}
