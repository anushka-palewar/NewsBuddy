package in.sp.main.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain)
        throws ServletException, IOException {

    final String authorizationHeader =
            request.getHeader("Authorization");

    String email = null;
    String jwt = null;

    if (authorizationHeader != null &&
            authorizationHeader.startsWith("Bearer ")) {

        jwt = authorizationHeader.substring(7);
        email = jwtUtil.extractEmail(jwt);
    }

    // Skip DB lookup for hardcoded admin but populate security context
    if (email != null && (email.toLowerCase().endsWith("@admin.com") || "admin@newswebsite.com".equals(email))) {
        try {
            if (jwtUtil.validateToken(jwt, email)) {
                UserDetails userDetails = new org.springframework.security.core.userdetails.User(
                        email,
                        "",
                        java.util.Collections.singletonList(() -> "ROLE_ADMIN")
                );
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());
                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request));
                SecurityContextHolder.getContext()
                        .setAuthentication(authToken);
            }
        } catch (Exception e) {
            System.out.println("JWT Admin Error: " + e.getMessage());
        }
        filterChain.doFilter(request, response);
        return;
    }

    if (email != null &&
            SecurityContextHolder.getContext()
                    .getAuthentication() == null) {

        try {

            UserDetails userDetails =
                    userDetailsService.loadUserByUsername(email);

            if (jwtUtil.validateToken(
                    jwt,
                    userDetails.getUsername())) {

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());

                authToken.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request));

                SecurityContextHolder.getContext()
                        .setAuthentication(authToken);
            }

        } catch (Exception e) {
            System.out.println("JWT Error: " + e.getMessage());
        }
    }

    filterChain.doFilter(request, response);
    }
}