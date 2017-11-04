package parsing.factory;

import java.io.IOException;
import objects.Page;

/**
 * @author Gutemberg
 * Cette classe sp�cifie la structure des sous-parsers utilis�s dans le cas des fichiers fonctionnant par balisage simple
 */
public interface TagParser
{
	/**
	 * Fonction d'entr�e pour le parsing d'un string
	 * @param text
	 * 		Le contenu textuel devant �tre pars�
	 * @param page
	 * 		La page courante sur laquelle le parser va evoluer
	 * @return ce qui n'a pas �t� pars�
	 * @throws IOException
	 */
	String parse(String text, Page page) throws IOException;
}
