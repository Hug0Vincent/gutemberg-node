package parsing.format.reco.parsers;

import java.io.IOException;

import objects.Page;
import parsing.factory.Parser;
import parsing.factory.TagParser;
import parsing.format.reco.RecoParser;


/**
 * @author Gutemberg
 * Cette classe reconnait la balise 'docReco'
 */
public class DocReco implements TagParser
{
	public String parse(String text, Page page) throws IOException
	{
		int i = Parser.findCorrespondantIndex(text, '[', ']');
		parseZone(text.substring(0, i), page);
		text = text.substring(i+1);
		return text;
	}
	
	//Permet de parser les éléments informant d'une zone dans le document
	private void parseZone(String args, Page page) throws IOException
	{
		int i = 0;
		if(args.length() > 0 && args.charAt(0) != ']')
		{
			//On boucle sur tous les éléments contenus
			do
			{
				int x = Parser.findIndex(args, '(');
				args = args.substring(x);
				i = Parser.findCorrespondantIndex(args, '(', ')');
				//parsing récursif
				RecoParser.INSTANCE.parse(args.substring(1, i), page);
			}
			while(args.substring(i).length() > 0 && (args = args.substring(i)).charAt(0) == ',' && !(args = args.substring(2)).equals("\0"));
		}
	}
}