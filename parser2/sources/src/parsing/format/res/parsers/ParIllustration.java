package parsing.format.res.parsers;
import java.io.IOException;

import objects.Page;
import parsing.factory.Parser;
import parsing.factory.TagParser;
import parsing.format.res.ResParser;

/**
 * @author Gutemberg
 * Cette classe reconnait les balises 'parIllustration', 'parImg' et 'parTableau'
 */
public class ParIllustration implements TagParser
{
	public String parse(String text, Page page) throws IOException
	{
		page.newArticle();
		text = text.substring(Parser.findIndex(text, '('));
		int i = Parser.findCorrespondantIndex(text, '(', ')');
		parseArgs(text.substring(1,i), page);
		text = text.substring(i+1);
		page.inputIsParent();
		return text;
	}
	
	private void parseArgs(String args, Page page) throws IOException
	{
		ResParser.INSTANCE.parse(args, page);
	}
}
