package hu.me.asnqph.repository;

import hu.me.asnqph.domain.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    List<Book> findAll();

    List<Book> findByBookId(long id);

    void deleteById(Long id);
}
