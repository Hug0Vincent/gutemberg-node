package parsing.format.res;
import objects.Page;
import parsing.factory.TagParser;


/**
 * @author Gutemberg
 * Parser particulier lié à la gestion des erreurs du parsing des fichiers RES
 */
public class ErrorParser implements TagParser
{
	/**
	 * Balise inconnue
	 */
	private String balise;
	public ErrorParser(String s)
	{
		balise = s;
	}
	
	/**
	 * Informe de la découverte d'une balise inconnue dans le parsing d'un fichier RES
	 */
	public String parse(String text, Page page)
	{
		System.err.println("[Parsing RES] : balise inconue <"+balise+">");
		return "\0";
	}
	
}
