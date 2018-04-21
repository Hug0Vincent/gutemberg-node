package parsing.factory;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import objects.Document;
import objects.Page;

/**
 * @author Gutemberg
 * Parser vide dans le cas d'une erreur, on ne touche pas au fichier
 */
public class EmptyParser implements SpecializedParser
{
	/**
	 * Singleton de l'objet
	 */
	public static final SpecializedParser INSTANCE = new EmptyParser();
	private EmptyParser() {
	}

	@Override
	public String parse(File file, Page page) throws IOException {
		return null;
	}

	@Override
	public Document getDocument(String path, HashMap<String, Document> documents) {
		return null;
	}

	@Override
	public Page getPage(String path, Document document) {
		return null;
	}

	@Override
	public String parse(String text, Page page) throws IOException {
		return null;
	}

}
