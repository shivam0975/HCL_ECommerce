using System.ComponentModel.DataAnnotations;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly EcommerceDbContext _context;

        public ProductController(EcommerceDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/Product
        [HttpGet("AllProducts")]
        public async Task<ActionResult<IEnumerable<ProductResponse>>> GetProducts()
        {
            var products = await _context.Products
                .AsNoTracking()
                .Select(p => ToResponse(p))
                .ToListAsync();

            return Ok(products);
        }

        // ✅ GET: api/Product/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ProductResponse>> GetProduct(int id)
        {
            var product = await _context.Products.AsNoTracking().FirstOrDefaultAsync(p => p.ProductId == id);
            if (product == null)
            {
                return NotFound();
            }

            return Ok(ToResponse(product));
        }

        // ✅ POST: api/Product
        [HttpPost]
        public async Task<ActionResult<ProductResponse>> CreateProduct(CreateProductRequest request)
        {
            var product = new Product
            {
                Name = request.Name.Trim(),
                Description = request.Description,
                Price = request.Price,
                Stock = request.Stock,
                CreatedAt = DateTime.UtcNow
            };

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetProduct), new { id = product.ProductId }, ToResponse(product));
        }

        // ✅ PUT: api/Product/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProduct(int id, UpdateProductRequest request)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            product.Name = request.Name.Trim();
            product.Description = request.Description;
            product.Price = request.Price;
            product.Stock = request.Stock;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ✅ DELETE: api/Product/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private static ProductResponse ToResponse(Product product) =>
            new(product.ProductId, product.Name, product.Description, product.Price, product.Stock, product.CreatedAt);

        public record ProductResponse(int ProductId, string? Name, string? Description, decimal? Price, int? Stock, DateTime? CreatedAt);

        public class CreateProductRequest
        {
            [Required]
            [StringLength(150)]
            public string Name { get; set; } = string.Empty;

            public string? Description { get; set; }

            [Range(0, 9999999999d)]
            public decimal Price { get; set; }

            [Range(0, int.MaxValue)]
            public int Stock { get; set; }
        }

        public class UpdateProductRequest : CreateProductRequest;
    }
}
