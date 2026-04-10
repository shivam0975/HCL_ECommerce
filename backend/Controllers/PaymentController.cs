using System.ComponentModel.DataAnnotations;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public PaymentController(EcommerceDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/Payment
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentResponse>>> GetPayments()
        {
            var payments = await _context.Payments
                .AsNoTracking()
                .Select(p => ToResponse(p))
                .ToListAsync();

            return Ok(payments);
        }

        // ✅ GET: api/Payment/5
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentResponse>> GetPayment(int id)
        {
            var payment = await _context.Payments.AsNoTracking().FirstOrDefaultAsync(p => p.PaymentId == id);
            if (payment == null)
            {
                return NotFound();
            }

            return Ok(ToResponse(payment));
        }

        // ✅ POST: api/Payment
        [HttpPost]
        public async Task<ActionResult<PaymentResponse>> CreatePayment(CreatePaymentRequest request)
        {
            if (!await _context.Orders.AnyAsync(o => o.OrderId == request.OrderId))
            {
                return BadRequest(new { message = "Invalid order id." });
            }

            var payment = new Payment
            {
                OrderId = request.OrderId,
                PaymentMethod = request.PaymentMethod.Trim(),
                PaymentStatus = request.PaymentStatus.Trim(),
                PaidAt = DateTime.UtcNow
            };

            _context.Payments.Add(payment);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetPayment), new { id = payment.PaymentId }, ToResponse(payment));
        }

        // ✅ PUT: api/Payment/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdatePayment(int id, UpdatePaymentRequest request)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
            {
                return NotFound();
            }

            if (!await _context.Orders.AnyAsync(o => o.OrderId == request.OrderId))
            {
                return BadRequest(new { message = "Invalid order id." });
            }

            payment.OrderId = request.OrderId;
            payment.PaymentMethod = request.PaymentMethod.Trim();
            payment.PaymentStatus = request.PaymentStatus.Trim();
            payment.PaidAt = request.PaidAt;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ✅ DELETE: api/Payment/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePayment(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
            {
                return NotFound();
            }

            _context.Payments.Remove(payment);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private static PaymentResponse ToResponse(Payment payment) =>
            new(payment.PaymentId, payment.OrderId, payment.PaymentMethod, payment.PaymentStatus, payment.PaidAt);

        public record PaymentResponse(int PaymentId, int? OrderId, string? PaymentMethod, string? PaymentStatus, DateTime? PaidAt);

        public class CreatePaymentRequest
        {
            [Range(1, int.MaxValue)]
            public int OrderId { get; set; }

            [Required]
            [StringLength(50)]
            public string PaymentMethod { get; set; } = string.Empty;

            [Required]
            [StringLength(50)]
            public string PaymentStatus { get; set; } = string.Empty;
        }

        public class UpdatePaymentRequest : CreatePaymentRequest
        {
            public DateTime? PaidAt { get; set; }
        }
    }
}
