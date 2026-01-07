using System.Text;
using API.Middleware;
using Application.Interfaces.Reports;
using Application.Interfaces.Auth;
using Application.Interfaces.Security;
using Application.Interfaces.Tickets;
using Application.Interfaces.SupportManager;
using Application.Interfaces.Admin;            // ✅ NEW (Admin governance)
using Application.Services.Auth;
using Application.Services.Reports;
using Application.Services.Security;
using Application.Services.Tickets;
using Application.Services.Tickets.Monitoring;
using Application.Services.Admin;               // ✅ NEW (Admin governance)
using Application.Services.SupportManager;  
using Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Application.Services;

var builder = WebApplication.CreateBuilder(args);

// --------------------
// Add services
// --------------------

// Controllers
builder.Services.AddControllers();

// --------------------
// DbContext (Infrastructure)
// --------------------
builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")
    );
});

// --------------------
// Application Services
// --------------------

// Phase 2 – Auth & Security
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IJwtTokenService, JwtTokenService>();

// Phase 3 – Ticket Business Logic (NO ADMIN ACCESS)
builder.Services.AddScoped<ITicketService, TicketService>();

// Phase 4 – SLA & Intelligence
builder.Services.AddScoped<ISlaService, SlaService>();
builder.Services.AddScoped<IAutoAssignmentService, AutoAssignmentService>();

//Reporting Service 
builder.Services.AddScoped<IReportingService, ReportingService>();

// Phase 4 – Monitoring (internal orchestration)
builder.Services.AddScoped<SlaMonitoringService>();

// Phase 5 – Admin Governance 
builder.Services.AddScoped<IAdminUserService, AdminUserService>();

// Phase 5 – Admin Master Data

builder.Services.AddScoped<IAdminMasterDataService, AdminMasterDataService>();

// Ticket Comment Service 
builder.Services.AddScoped<ITicketCommentService, TicketCommentService>();

// Agent Dashboard Service
builder.Services.AddScoped<IAdminDashboardService, AdminDashboardService>();

builder.Services.AddScoped<ISupportManagerQueueService, SupportManagerQueueService>();
builder.Services.AddScoped<ISupportManagerAssignmentService, SupportManagerAssignmentService>();
builder.Services.AddScoped<ISupportAgentLookupService, SupportAgentLookupService>();






// --------------------
// JWT Authentication
// --------------------
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],

            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
            )
        };
    });

builder.Services.AddAuthorization();

// --------------------
// Swagger
// --------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --------------------
// Build app
// --------------------
var app = builder.Build();

// --------------------
// Middleware pipeline
// --------------------
app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// IMPORTANT: Authentication BEFORE Authorization
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// --------------------
// Apply migrations + seed data
// --------------------
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    // Apply pending migrations automatically
    context.Database.Migrate();

    // Seed master data (roles, admin user, priorities, SLAs, etc.)
    DbSeeder.Seed(context);
}

app.Run();
