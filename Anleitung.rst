.. sectnum::

.. header::
    
    Studium Generale - Simulation der Zukunft

==================================
Schattenwurf - Bedienungsanleitung
==================================

|
|
|
|
|
|
|
|

.. class:: center

    :Modul: Studium Generale

    :Thema: Simulation der Zukunft

    :Inhalt: "Simulation eines Schattenwurfes."


|
|
|
|
|
|
|
|
|
|
|
|


Eingesendet von:
    Christoph Jung, Malte Krupa, Dominik Nagel, Daniel Roth

Eingesendet am:
    06.07.2015

Professoren: 
    Prof. Dr. Ralf-Rainer Schulz (Fb 1)

    Prof. Dr. Gerd Doeben-Henisch (Fb 2)

    Prof. Dr. Christian Rieck (Fb 3)

.. raw:: pdf

   PageBreak oneColumn

.. contents:: Index
   :depth: 2

.. raw:: pdf

   PageBreak oneColumn


Bedienungsanleitung
===================

Erreichbarkeit
--------------

Die Simulation wurde in JavaScript fuer den Browser entwickelt und ist
jeder Zeit unter folgender URL erreichbar:

https://nafn.de/simdezuk

Da auf dieser Seite das Zertifikat abgelaufen ist, kommt es beim ersten
Aufruf zu einem Fehler, welcher nicht bestandteil der Simulation ist.

HINWEIS: Die Simulation laeuft am Besten in Firefox 38 und Google Chrome 43.
Der Internet Explorer ist weitestgehend ausgeschlossen.


Quellcode
---------

Der Quellcode wurde in zwei unterschiedlichen Repositories entwickelt.

Anfangs noch bei Daniel Rooth auf Github: https://github.com/Darot/sunsimulation

Spaeter dann bei Malte Krupa auf Github: https://github.com/temal-/sunsimulation

Uebersicht
----------

Der Bildschirm ist in drei Ansichten geteilt.

Links
_____

Die linke Ansicht dient dem dynamischen navigieren mittels der Tastatur.

Rechts
______

Die rechte Seite ist in zwei eigenstaendige Kameras unterteilt. Die obere
Kamera zeigt eine Ansicht im Haus, die untere eine Ansicht von oben auf die
zwei Haeuser.

Menue rechts
____________

Mit dem Buchstaben 'h' auf der Tastatur, kann man sich ein Menue
zur Konfiguration der Simulation einblenden lassen.

Informationsfenster unten Links
_______________________________

Hier werden vier konstant vier Informationen eingeblendet.

- Das aktuelle Datum der Simulation
- Der aktuelle Status der Simulation
- Der Azimut der Sonne ausgehend von sueden
- Die Hoehe der Sonne als Wert zwischen 0 und PI/2.

Steuerung
---------

Maus
____

Die Maus spielt bei der Bedienung eine untergeordnete Rolle. Diese ist nur
zum Aendern und Auswaehlen von Parametern in der GUI auf der rechten Seite
da.

Tastatur
________

Die Tastatur hat folgende Funktionen:

+------------+-------------------------------------------+
| Taste      | Funktion                                  |
+============+===========================================+
| W          | Vorwaertsbewegung                         |
+------------+-------------------------------------------+
| A          | Seitwaertsbewegung links                  |
+------------+-------------------------------------------+
| S          | Rueckwaertsbeweung                        |
+------------+-------------------------------------------+
| D          | Seitwaertsbeweung rechts                  |
+------------+-------------------------------------------+
| Q          | Linksrotation                             |
+------------+-------------------------------------------+
| E          | Rechtsrotation                            |
+------------+-------------------------------------------+
| R          | Hoch                                      |
+------------+-------------------------------------------+
| F          | Runter                                    |
+------------+-------------------------------------------+
| Pfeil auf  | Kamera dreht hoch                         |
+------------+-------------------------------------------+
| Pfeil links| Kamera dreht links                        |
+------------+-------------------------------------------+
| Pfeil recht| Kamera dreht rechts                       |
+------------+-------------------------------------------+
| Pfeil ab   | Kamera dreht runter                       |
+------------+-------------------------------------------+
| X          | Zentriere Ansicht auf den Mittelpunkt     |
+------------+-------------------------------------------+
| C          | Reset Kamera links                        |
+------------+-------------------------------------------+
| V          | Reset Kamera rechts unten                 |
+------------+-------------------------------------------+
| B          | Reset Kamera rechts oben                  |
+------------+-------------------------------------------+
| M          | Erlaube Maussteuerung fuer Kamera RO      |
+------------+-------------------------------------------+
| H          | Menu Ein- und Ausblenden                  |
+------------+-------------------------------------------+
| Leertaste  | Simulation starten bzw. stoppen           |
+------------+-------------------------------------------+


