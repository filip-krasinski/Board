package io.github.nesz.server.util;

import org.springframework.data.util.Pair;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.InputStream;
import java.util.Optional;

public final class FileUtils {

    private FileUtils() { }

    public static String getExtension(String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    public static Optional<Pair<Integer, Integer>> parseImage(MultipartFile mf) {
        try (InputStream in = mf.getInputStream()) {
            BufferedImage read = ImageIO.read(in);
            return Optional.of(Pair.of(read.getWidth(), read.getHeight()));
        } catch (Exception ignored) { }

        return Optional.empty();
    }

}
