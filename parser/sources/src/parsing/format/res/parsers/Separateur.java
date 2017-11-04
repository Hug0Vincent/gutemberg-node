package parsing.format.res.parsers;
import java.io.IOException;

import objects.Page;
import parsing.factory.TagParser;

/**
 * @author Gutemberg
 * Cette classe reconnait les balises 'separateurFinColonne', 'separateurTrait' et 'separateurFinArticle'
 */
public class Separateur implements TagParser
{
	public String parse(String text, Page page) throws IOException
	{
		return text;
	}
}
