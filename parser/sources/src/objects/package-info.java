/**
 * @author Gutemberg
 * Ce package contient toutes les donn�es permettant d'extraire le format de fichier Json g�n�rique pour le projet Gutemberg
 * 
 * Le format g�n�r� est une liste d'objets Json.
 * Pour rappel, une liste est d�limit�e par les caract�res [] et un objet par les caract�res {} et chaque �l�ment, objet ou attribut, est s�par� par une virgule.
 * 
 * La liste est constitu�e d'objets 'Document'.
 * Un objet 'Document' est d�crit par 4 attributs :
 * 		- type : un attribut correspondant � une constante (presse ancienne, d�crets naturalisation...) [String]
 * 		- date : la date � laquelle le document a �t� �crit [String au format jj/mm/aaaa]
 * 		- title : le titre du document [String]
 * 		- pages : une liste contenant des objets 'Page' [liste d'objets]
 * 
 * Un objet 'Page' est d�crit par 3 attributs :
 * 		- id : le num�ro de la page. C'est un identifiant unique dans un document [Integer]
 * 		- image : le chemin relatif de l'image correspondant au scan de la page [String]
 * 		- sheetsIndex : une liste contenant des objets 'Fiche'  [liste d'objets]
 * 
 * Un objet 'Fiche' est d�crit par 4 attributs :
 * 		- type : un attribut textuel correspondant au type de l'objet. Sa valeur est �gale � "sheet" [String]
 * 		- name : le nom donn� � la fiche par le syst�me. C'est l'attribut qui permet de lister les noms requis ou interdits pour un type de document [String]
 * 		- points : une liste d'objets 'Point' permettant de dessiner la zone de la fiche � l'�cran [liste d'objets]
 * 		- listInputs : une liste contenant � la fois des objets 'Fiche' et des objets 'Champ' [liste d'objets]
 * 
 * Un objet 'Point' est d�crit par 2 attributs :
 * 		- x : la coordonn�e 'x' en pixels du point [Integer]
 * 		- y : la coordonn�e 'y' en pixels du point [Integer]
 * 
 * Un objet 'Champ' est d�crit par 4 attributs :
 * 		- type : un attribut textuel correspondant au type de l'objet. Sa valeur est �gale � "area" [String]
 * 		- name : le nom donn� au champ par le syst�me. C'est l'attribut qui permet de lister les noms requis ou interdits pour un type de document [String]
 * 		- points : une liste d'objets 'Point' permettant de dessiner la zone du champ � l'�cran [liste d'objets]
 * 		- annotations : une liste contenant des objets 'Annotation' [liste d'objets]
 * 
 * Un objet 'Annotation' est d�crit par 4 attributs :
 * 		- type : un attribut textuel correspondant au type de l'objet. Sa valeur est �gale � "annotationAutomatic" [String]
 * 		- modifiable : indique si l'annotation est modifiable. Dans les cas des annotations automatiques, ce champ est forc�ment �gal � 'false' [Boolean]
 * 		- textAuto : texte reconnu par l'outil d'Intuidoc [String]
 * 		- lines : une liste contenant des objets 'Ligne' [liste d'objets]
 * 
 * Un objet 'Ligne' est d�crit par 2 attributs :
 * 		- text : texte reconnu par l'outil d'Intuidoc sur la ligne courante. Le texte de toutes les lignes d'une annotation permettent de former la variable 'textAuto' d'une annotation [String]
 * 		- points : une liste d'objets 'Point' permettant de dessiner la zone de la ligne � l'�cran [liste d'objets]
 * 
 */

package objects;