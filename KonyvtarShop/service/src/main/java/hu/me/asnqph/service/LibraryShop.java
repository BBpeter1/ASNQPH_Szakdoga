package hu.me.asnqph.service;

import hu.me.asnqph.domain.Author;
import hu.me.asnqph.domain.Book;
import hu.me.asnqph.domain.User;

import java.util.List;

public interface LibraryShop {

    User getLoggedInUser();
    List<Author> getAuthors();
    List<Book> getBooks();

}
