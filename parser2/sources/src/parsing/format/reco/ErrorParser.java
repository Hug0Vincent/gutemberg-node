package parsing.format.reco;
import objects.Page;
import parsing.factory.TagParser;


/**
 * @author Gutemberg
 * Parser particulier lié é la gestion des erreurs du parsing des fichiers RECO
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
	 * Informe de la découverte d'une balise inconnue dans le parsing d'un fichier RECO
	 */
	public String parse(String text, Page page)
	{
		System.err.println("[Parsing RECO] : balise inconue <"+balise+">");
		return "\0";
	}
}
