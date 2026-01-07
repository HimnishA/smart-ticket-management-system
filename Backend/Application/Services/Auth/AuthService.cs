using Application.DTOs.Auth;
using Application.Exceptions;
using Application.Interfaces.Auth;
using Application.Interfaces.Security;
using Domain.Entities;
using Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Application.Services.Auth;

public sealed class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IJwtTokenService _jwtTokenService;

    public AuthService(
        ApplicationDbContext context,
        IJwtTokenService jwtTokenService)
    {
        _context = context;
        _jwtTokenService = jwtTokenService;
    }

    // -------------------------
    // LOGIN (GOVERNED)
    // -------------------------
    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto request)
    {
        var user = await _context.Users
            .Include(u => u.UserRoles)
                .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Email == request.Email);

        // 1️⃣ Validate credentials
        if (user == null ||
            !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedException("Invalid email or password.");
        }

        // 2️⃣ User must be active
        if (!user.IsActive)
        {
            throw new UnauthorizedException(
                "User account is inactive. Please contact administrator.");
        }

        // 3️⃣ User must be approved by Admin
        if (!user.IsApproved)
        {
            throw new UnauthorizedException(
                "Account pending admin approval.");
        }

        // 4️⃣ User must have roles assigned
        if (!user.UserRoles.Any())
        {
            throw new UnauthorizedException(
                "User has no roles assigned. Please contact administrator.");
        }

        var roles = user.UserRoles
            .Select(ur => ur.Role.Name)
            .ToList();

        var token = _jwtTokenService.GenerateToken(user, roles);

        return new LoginResponseDto
        {
            Token = token,
            ExpiresAt = DateTime.UtcNow.AddHours(2),
            User = new AuthUserDto
            {
                UserId = user.Id,
                Email = user.Email,
                Roles = roles
            }
        };
    }

    // -------------------------
    // REGISTER (ADMIN-GOVERNED)
    // -------------------------
    public async Task RegisterAsync(RegisterRequestDto dto)
    {
        var exists = await _context.Users
            .AnyAsync(u => u.Email == dto.Email);

        if (exists)
            throw new BusinessRuleViolationException("Email already registered");

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),

            // Governance defaults
            IsApproved = false,
            IsActive = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
    }
}
