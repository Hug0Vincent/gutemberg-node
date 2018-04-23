package parsing.factory;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;

import objects.Document;
import objects.Page;

/**
 * @author Gutemberg
 * Cette classe spécifie la structure de chaque parser d'entrée pour une extension données.
 */
public interface SpecializedParser 
{
	/**
	 * Fonction d'entrée pour le parsing d'un fichier
	 * @param file
	 * 		Le fichier contenant le texte é parser
	 * @param page
	 * 		La page courante sur laquelle le parser va evoluer
	 * @return ce qui n'a pas été parsé
	 * @throws IOException
	 */
	String parse(File file, Page page) throws IOException;
	
	/**
	 * Fonction d'entrée pour le parsing d'un string
	 * @param text
	 * 		Le contenu textuel devant étre parsé
	 * @param page
	 * 		La page courante sur laquelle le parser va evoluer
	 * @return ce qui n'a pas été parsé
	 * @throws IOException
	 */
	String parse(String text, Page page) throws IOException;
	
	/**
	 * Fonction permettant de récupérer le document correspondant au nom du fichier
	 * @param path
	 * 		Chemin d'accés au fichier
	 * @param documents
	 * 		Liste des documents existant
	 * @return Le document correspondant
	 */
	Document getDocument(String path, HashMap<String, Document> documents);
	
	/**
	 * Fonction permettant de récupérer la page d'un document correspondante au nom du fichier
	 * @param path
	 * 		Chemin d'accés au fichier
	 * @param document
	 * 		Document correspondant au fichier
	 * @return La page correspondante
	 */
	Page getPage(String path, Document document);
}
