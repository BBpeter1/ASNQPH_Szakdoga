package hu.me.asnqph.controller;

import hu.me.asnqph.domain.Book;
import hu.me.asnqph.repository.AuthorRepository;
import hu.me.asnqph.repository.BookRepository;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;


@Controller
@RequestMapping("/books")
public class BookController {
    private final BookRepository bookRepository;
    private final AuthorRepository authorRepository;

    public BookController(BookRepository bookRepository, AuthorRepository authorRepository) {
        this.bookRepository = bookRepository;
        this.authorRepository = authorRepository;
    }

    @GetMapping
    public String listBooks(Model model) {
        model.addAttribute("books", bookRepository.findAll());
        return "book/list";
    }

    @GetMapping("/add")
    public String addBookForm(Model model) {
        model.addAttribute("book", new Book());
        model.addAttribute("authors", authorRepository.findAll());
        return "book/add";
    }

    @PostMapping("/add")
    public String addBook(@ModelAttribute("book") Book book) {
        bookRepository.save(book);
        return "redirect:/books";
    }

    @GetMapping("/{id}/edit")
    public String editBookForm(@PathVariable("id") Long id, Model model) {
        Book book = bookRepository.findByBookId(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid book id: " + id));
        model.addAttribute("book", book);
        model.addAttribute("authors", authorRepository.findAll());
        return "book/edit";
    }

    @PostMapping("/{id}/edit")
    public String editBook(@PathVariable("id") Long id, @ModelAttribute("book") Book book) {
        Book existingBook = bookRepository.findByBookId(id)
                .orElseThrow(() -> new IllegalArgumentException("Invalid book id: " + id));
        existingBook.setTitle(book.getTitle());
        existingBook.setAuthors(book.getAuthors());
        bookRepository.save(existingBook);
        return "redirect:/books";
    }

    @GetMapping("/{id}/delete")
    public String deleteBook(@PathVariable("id") Long id) {
        bookRepository.deleteById(id);
        return "redirect:/books";
    }
}

