/**
 * @author Gutemberg
 * Ce package contient toutes les données permettant d'extraire le format de fichier Json générique pour le projet Gutemberg
 * 
 * Le format généré est une liste d'objets Json.
 * Pour rappel, une liste est délimitée par les caractères [] et un objet par les caractères {} et chaque élément, objet ou attribut, est séparé par une virgule.
 * 
 * La liste est constituée d'objets 'Document'.
 * Un objet 'Document' est décrit par 4 attributs :
 * 		- type : un attribut correspondant à une constante (presse ancienne, décrets naturalisation...) [String]
 * 		- date : la date à laquelle le document a été écrit [String au format jj/mm/aaaa]
 * 		- title : le titre du document [String]
 * 		- pages : une liste contenant des objets 'Page' [liste d'objets]
 * 
 * Un objet 'Page' est décrit par 3 attributs :
 * 		- id : le numéro de la page. C'est un identifiant unique dans un document [Integer]
 * 		- image : le chemin relatif de l'image correspondant au scan de la page [String]
 * 		- sheetsIndex : une liste contenant des objets 'Fiche'  [liste d'objets]
 * 
 * Un objet 'Fiche' est décrit par 4 attributs :
 * 		- type : un attribut textuel correspondant au type de l'objet. Sa valeur est égale à "sheet" [String]
 * 		- name : le nom donné à la fiche par le système. C'est l'attribut qui permet de lister les noms requis ou interdits pour un type de document [String]
 * 		- points : une liste d'objets 'Point' permettant de dessiner la zone de la fiche à l'écran [liste d'objets]
 * 		- listInputs : une liste contenant à la fois des objets 'Fiche' et des objets 'Champ' [liste d'objets]
 * 
 * Un objet 'Point' est décrit par 2 attributs :
 * 		- x : la coordonnée 'x' en pixels du point [Integer]
 * 		- y : la coordonnée 'y' en pixels du point [Integer]
 * 
 * Un objet 'Champ' est décrit par 4 attributs :
 * 		- type : un attribut textuel correspondant au type de l'objet. Sa valeur est égale à "area" [String]
 * 		- name : le nom donné au champ par le système. C'est l'attribut qui permet de lister les noms requis ou interdits pour un type de document [String]
 * 		- points : une liste d'objets 'Point' permettant de dessiner la zone du champ à l'écran [liste d'objets]
 * 		- annotations : une liste contenant des objets 'Annotation' [liste d'objets]
 * 
 * Un objet 'Annotation' est décrit par 4 attributs :
 * 		- type : un attribut textuel correspondant au type de l'objet. Sa valeur est égale à "annotationAutomatic" [String]
 * 		- modifiable : indique si l'annotation est modifiable. Dans les cas des annotations automatiques, ce champ est forcément égal à 'false' [Boolean]
 * 		- textAuto : texte reconnu par l'outil d'Intuidoc [String]
 * 		- lines : une liste contenant des objets 'Ligne' [liste d'objets]
 * 
 * Un objet 'Ligne' est décrit par 2 attributs :
 * 		- text : texte reconnu par l'outil d'Intuidoc sur la ligne courante. Le texte de toutes les lignes d'une annotation permettent de former la variable 'textAuto' d'une annotation [String]
 * 		- points : une liste d'objets 'Point' permettant de dessiner la zone de la ligne à l'écran [liste d'objets]
 * 
 */

package objects;