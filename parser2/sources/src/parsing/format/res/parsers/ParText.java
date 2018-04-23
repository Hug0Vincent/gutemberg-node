package parsing.format.res.parsers;
import java.io.IOException;

import objects.Page;
import parsing.factory.Parser;
import parsing.factory.TagParser;
import parsing.format.res.ResParser;

/**
 * @author Gutemberg
 * Cette classe reconnait la balise 'parText'
 */
public class ParText implements TagParser
{
	public String parse(String text, Page page) throws IOException
	{
		page.newArticle();
		//System.out.println("AVEC TITRE : "+(++CPT));
		text = text.substring(Parser.findIndex(text, '('));
		int i = Parser.findCorrespondantIndex(text, '(', ')'); // Informations sur le paragraphe
		parseArgs(text.substring(1,i), page);
		text = text.substring(i+1);
		text = text.substring(Parser.findIndex(text, '['));
		while(text.contains("["))
		{
			i = Parser.findCorrespondantIndex(text, '[', ']');
			parseContent(text.substring(1, i), page);
			text = text.substring(i+(text.length()> i ? 1 : 0));
		}
		page.inputIsParent();
		return text;
	}

	private void parseArgs(String args, Page page) throws IOException
	{
		ResParser.INSTANCE.parse(args, page);
	}
	private void parseContent(String content, Page page) throws IOException
	{
		int i;
		if(content.length() > 0 && content.charAt(0) != ']')
		{
			do
			{
				i = Parser.findCorrespondantIndex(content, '(', ')');
				//System.out.println(content);
				ResParser.INSTANCE.parse(content.substring(1, i), page);
			}
			while(content.substring(i).length() > 0 && (content = content.substring(i)).charAt(0) == ',' && !(content = content.substring(2)).equals("\0"));
		}
	}
}
