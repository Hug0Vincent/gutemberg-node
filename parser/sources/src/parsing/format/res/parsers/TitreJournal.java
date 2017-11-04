package parsing.format.res.parsers;

import java.io.IOException;

import objects.Page;
import parsing.factory.Parser;
import parsing.factory.TagParser;
import parsing.format.res.ResParser;

/**
 * @author Gutemberg
 * Cette classe reconnait la balise 'titreJournal'
 */
public class TitreJournal implements TagParser 
{
	public String parse(String text, Page page) throws IOException
	{
		page.addNewFiche("Titre de journal");
		//Le type du champ est défini à 'title'
		page.setFieldType("Titre");
		int i = Parser.findCorrespondantIndex(text, '(', ')');
		parseZone(text.substring(0, i), page);
		text = text.substring(i+1);
		i = Parser.findCorrespondantIndex(text, '[', ']');
		parseArgs(text.substring(1, i), page);
		page.setFieldType("");
		page.inputIsParent();
		return text;
	}
	
	//Appelle le parser pour la zone
	private void parseZone(String args, Page page) throws IOException
	{
		ResParser.INSTANCE.parse(args.substring(1), page);
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
