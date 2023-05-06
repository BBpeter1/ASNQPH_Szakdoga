package hu.me.asnqph;

import hu.me.asnqph.domain.User;
import hu.me.asnqph.service.DefaultLibraryShop;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserLoginService implements UserDetailsService {
    @Autowired
    private DefaultLibraryShop defaultLibraryShop;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = defaultLibraryShop.findUserByUsername(username);
        if (user == null) {
            throw new UsernameNotFoundException("Wrong Username or Password");
        }
        return new UserLoginDetails(user);
    }

    public String loadAuthenticatedUsername() {
        String username;
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        return username;
    }



}

