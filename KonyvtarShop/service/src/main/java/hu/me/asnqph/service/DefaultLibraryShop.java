package hu.me.asnqph.service;

import hu.me.asnqph.domain.Author;
import hu.me.asnqph.domain.Book;
import hu.me.asnqph.domain.User;
import hu.me.asnqph.repository.AuthorRepository;
import hu.me.asnqph.repository.BookRepository;
import hu.me.asnqph.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;


public class DefaultLibraryShop implements LibraryShop {

    private User loggedInUser;
    @Autowired
    private UserRepository uRep;
    @Autowired
    private BookRepository bRep;
    @Autowired
    private AuthorRepository aRep;

    private List<Book> destinationList;
    private List<User> users;
    private List<Author> reviewList;

    public DefaultLibraryShop() {}

    @Override
    public User getLoggedInUser() {
        return loggedInUser;
    }

    @Override
    public List<Book> getBooks() {
        return bRep.findAll();
    }

    public User findUserByUsername(String username) {

        users = uRep.findAll();
        return users.stream()
                .filter(user -> user.getCredentials().getLoginName().equals(username))
                .findFirst().orElse(null);
    }

    @Override
    public List<Author> getAuthors() {
        return aRep.findAll();
    }

}
