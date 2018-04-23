package parsing.format.reco.parsers;

import java.io.IOException;
import java.util.HashMap;
import objects.Page;
import parsing.factory.Parser;
import parsing.factory.TagParser;

/**
 * @author Gutemberg
 * Cette classe reconnait la balise 'caseReco'
 */
public class CaseReco implements TagParser
{
	/**
	 * Liste des types existant
	 */
	private static HashMap<String, String> types;
	static
	{
		types = new HashMap<>();
		types.put("caseMatricule","Matricule");
		types.put("caseNom","Nom");
		types.put("caseMobilisation","Mobilisation");
		types.put("caseEtatCivil","Etat civil");
		types.put("caseSignalement","Signalement");
		types.put("caseVideCanton","Canton");
		types.put("caseVideDegre","Degré");
		types.put("caseDecision","Décision");
		types.put("caseInfos","Informations");
		types.put("caseHabitation","Habitation");
		types.put("caseSecretGauche","Secret gauche");
		types.put("caseSecretDroite","Secret droit");
	}

	public String parse(String text, Page page) throws IOException
	{
		int i = Parser.findIndex(text, '(');
		//Récupére le type de l'élément
		String type = text.substring(0, i-1);

		page.addNewFiche("Matricule");
		page.addNewFiche("Signalement");
		page.addNewFiche("Nom");
		page.addNewFiche("Affectation");
		page.addNewFiche("Secret gauche");
		page.addNewFiche("Secret droit");
		page.addNewFiche("Conseil de révision");
		page.addNewFiche("Domicile");
		page.addNewFiche("Etat civil");

		page.setFieldType(types.get(type));

		page.newArticle();
		text = text.substring(i);

		i = Parser.findIndex(text, '[');
		text = text.substring(0, i-1);
		String point;
		while(text.length() > 1)
		{
			i = Parser.findCorrespondantIndex(text, '(', ')');
			point = text.substring(0, i-1);
			String[] coord = point.split(" ");
			int x = Integer.parseInt(coord[1]);
			int y = Integer.parseInt(coord[2]);
			page.getCurrentInput().addPoint(x,  y);
			text = text.substring(i);
			if(text.length() >  0)
				text = text.substring(1);
		}
		page.inputIsParent();
		page.inputIsParent();
		page.setFieldType("");
		return text;
	}

}
