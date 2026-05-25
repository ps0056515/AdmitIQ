package in.admitiq.common.filter;

import in.admitiq.common.context.TenantContext;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@Slf4j
public class TenantFilter extends OncePerRequestFilter {

    private static final String TENANT_HEADER = "X-Tenant-ID";
    private static final String TENANT_SLUG_HEADER = "X-Tenant-Slug";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        
        String tenantId = request.getHeader(TENANT_HEADER);
        if (tenantId == null) {
            tenantId = request.getHeader(TENANT_SLUG_HEADER);
        }
        if (tenantId == null) {
            tenantId = request.getParameter("tenantId");
        }

        if (tenantId != null) {
            log.trace("Found tenant context: {}", tenantId);
            TenantContext.setCurrentTenant(tenantId);
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            log.trace("Clearing tenant context");
            TenantContext.clear();
        }
    }
}
