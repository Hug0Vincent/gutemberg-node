package parsing.format.res.parsers;
import java.io.IOException;

import objects.Page;
import parsing.factory.Parser;
import parsing.factory.TagParser;
import parsing.format.res.ResParser;

/**
 * @author Gutemberg
 * Cette classe reconnait la balise 'titreA'
 */
public class TitreA implements TagParser 
{
	public String parse(String text, Page page) throws IOException
	{
		//Le type du champ est défini é 'title'
		page.setFieldType("Titre");
		int i = Parser.findCorrespondantIndex(text, '[', ']');
		parseArgs(text.substring(1, i), page);
		page.setFieldType("");
		return text;
	}
	
	private void parseArgs(String args, Page page)throws IOException
	{
		args = Parser.eliminateLX(args);
		int i;
		if(args.length() > 0 && args.charAt(0) != ']')
		{
			//On boucle sur tous les éléments contenus
			do
			{
				i = Parser.findCorrespondantIndex(args, '(', ')');
				//parsing récursif
				ResParser.INSTANCE.parse(args.substring(1, i), page);
			}
			while(args.substring(i).length() > 0 && (args = args.substring(i)).charAt(0) == ',' && !(args = args.substring(2)).equals("\0"));
		}
	}
}
