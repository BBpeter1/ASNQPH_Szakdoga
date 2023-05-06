package hu.me.asnqph.repository;

import hu.me.asnqph.domain.Author;
import hu.me.asnqph.domain.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuthorRepository extends JpaRepository<Author, Long> {

    List<Author> findAll();

    List<Author> findByAuthorId(long id);
}
