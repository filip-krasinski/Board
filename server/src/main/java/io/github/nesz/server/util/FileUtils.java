package io.github.nesz.server.util;

public final class FileUtils {

    private FileUtils() { }

    public static String getExtension(String filename) {
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

}
