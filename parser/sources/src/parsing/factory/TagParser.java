package parsing.factory;

import java.io.IOException;
import objects.Page;

/**
 * @author Gutemberg
 * Cette classe spécifie la structure des sous-parsers utilisés dans le cas des fichiers fonctionnant par balisage simple
 */
public interface TagParser
{
	/**
	 * Fonction d'entrée pour le parsing d'un string
	 * @param text
	 * 		Le contenu textuel devant être parsé
	 * @param page
	 * 		La page courante sur laquelle le parser va evoluer
	 * @return ce qui n'a pas été parsé
	 * @throws IOException
	 */
	String parse(String text, Page page) throws IOException;
}
