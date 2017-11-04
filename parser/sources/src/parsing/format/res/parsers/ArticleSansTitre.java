package parsing.format.res.parsers;
import java.io.IOException;

import objects.Page;
import parsing.factory.Parser;
import parsing.factory.TagParser;
import parsing.format.res.ResParser;

/**
 * @author Gutemberg
 * Cette classe reconnait la balise 'articleSansTitre'
 */
public class ArticleSansTitre implements TagParser 
{
	public String parse(String text, Page page) throws IOException
	{
		page.addNewFiche("Article");
		page.setFieldType("Paragraphe");
		int i;
		while(text.contains("["))
		{
			i = Parser.findCorrespondantIndex(text, '[', ']');
			parseArgs(text.substring(1, i), page);
			text = text.substring(i+(text.length()> i ? 1 : 0));
		}
		page.setFieldType("");
		page.inputIsParent();
		return text;
	}
	
	private void parseArgs(String args, Page page)throws IOException
	{
		args = Parser.eliminateLX(args);
		int i;
		if(args.length() > 0 && args.charAt(0) != ']')
		{
			do
			{
				int x = Parser.findIndex(args, '(');
				args = args.substring(x);
				i = Parser.findCorrespondantIndex(args, '(', ')');
				ResParser.INSTANCE.parse(args.substring(1, i), page);
			}
			while(args.substring(i).length() > 0 && (args = args.substring(i)).charAt(0) == ',' && !(args = args.substring(2)).equals("\0"));
		}
	}
}
