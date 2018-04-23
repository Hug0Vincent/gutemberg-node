package parsing.format.res.parsers;
import java.io.IOException;

import objects.Page;
import parsing.factory.Parser;
import parsing.factory.TagParser;
import parsing.format.res.ResParser;

/**
 * @author Gutemberg
 * Cette classe reconnait la balise 'zoneLst'
 */
public class ZoneLst implements TagParser
{
	public String parse(String text, Page page) throws IOException
	{
		int i = Parser.findCorrespondantIndex(text, '[', ']');
		parseArgs(text.substring(2, i), page);
		text = text.substring(i+1);
		return text;
	}
	
	//Permet de parser les données de zone
	private void parseArgs(String args, Page page)throws IOException
	{
		while((args = ResParser.INSTANCE.parse(args, page)).charAt(0) == ',')
			args= args.substring(3);
	}
}
