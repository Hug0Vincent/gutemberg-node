package parsing.factory;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import objects.Document;
import objects.Page;

/**
 * @author Gutemberg
 * Cette classe sp�cifie la structure de chaque parser d'entr�e pour une extension donn�es.
 */
public interface SpecializedParser 
{
	/**
	 * Fonction d'entr�e pour le parsing d'un fichier
	 * @param file
	 * 		Le fichier contenant le texte � parser
	 * @param page
	 * 		La page courante sur laquelle le parser va evoluer
	 * @return ce qui n'a pas �t� pars�
	 * @throws IOException
	 */
	String parse(File file, Page page) throws IOException;
	
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
	
	/**
	 * Fonction permettant de r�cup�rer le document correspondant au nom du fichier
	 * @param path
	 * 		Chemin d'acc�s au fichier
	 * @param documents
	 * 		Liste des documents existant
	 * @return Le document correspondant
	 */
	Document getDocument(String path, HashMap<String, Document> documents);
	
	/**
	 * Fonction permettant de r�cup�rer la page d'un document correspondante au nom du fichier
	 * @param path
	 * 		Chemin d'acc�s au fichier
	 * @param document
	 * 		Document correspondant au fichier
	 * @return La page correspondante
	 */
	Page getPage(String path, Document document);
}
