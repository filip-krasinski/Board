package io.github.nesz.server.user.post;

import io.github.nesz.server.user.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends PagingAndSortingRepository<Post, Long> {

    Optional<Post> findById(Long id);

}
