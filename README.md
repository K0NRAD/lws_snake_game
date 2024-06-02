# LWS Snake Game

### Snake-Spiel der Open Lehrwerkstatt 2024

#### Projektziel und Zweck

Open Lehrwerkstatt 2024! Diese Veranstaltung fördert den Austausch von Wissen, die kreative Zusammenarbeit und das praktische Lernen. In diesem Jahr haben wir uns für ein klassisches Projekt entschieden: die Entwicklung eines Snake-Spiels.

#### Zweck des Projekts

Das Snake-Spiel dient mehreren pädagogischen und praktischen Zwecken:

1. **Einführung in die Programmierung**: 
   - Das Snake-Spiel ist ein hervorragendes Beispiel, um grundlegende Programmierkonzepte wie Schleifen, Bedingungen, Funktionen und Arrays zu vermitteln. Es bietet eine praxisnahe Möglichkeit, diese Konzepte zu erlernen und anzuwenden.

2. **Verständnis der Spielentwicklung**:
   - Durch die Entwicklung dieses Spiels erhalten die Teilnehmer Einblicke in die Mechaniken und Logiken, die hinter der Erstellung von Videospielen stehen. Dazu gehören die Spiellogik, die Kollisionserkennung, die Steuerung und die grafische Darstellung.

3. **Förderung von Kreativität und Problemlösung**:
   - Die Teilnehmer werden ermutigt, kreative Lösungen zu entwickeln und das Spiel nach ihren eigenen Vorstellungen zu erweitern. Dies kann das Hinzufügen neuer Funktionen, die Anpassung des Designs oder das Verbessern der Benutzeroberfläche umfassen.

4. **Teamarbeit und Zusammenarbeit**:
   - Das Projekt ist darauf ausgelegt, die Zusammenarbeit und den Austausch zwischen den Teilnehmern zu fördern. Durch Teamarbeit lernen die Teilnehmer, wie man effektiv kommuniziert, Probleme gemeinsam löst und zusammen an einem gemeinsamen Ziel arbeitet.

5. **Anwendung moderner Webtechnologien**:
   - Das Snake-Spiel wird unter Verwendung moderner Webtechnologien wie HTML, CSS und JavaScript entwickelt. Dies gibt den Teilnehmern praktische Erfahrungen mit Technologien, die in der heutigen Webentwicklung weit verbreitet sind.

#### Warum Snake?

Das Snake-Spiel wurde aufgrund seiner Einfachheit und seines hohen Lernwerts ausgewählt. Es ist leicht verständlich, bietet jedoch genügend Tiefe, um verschiedene Programmier- und Designkonzepte zu erkunden. Es stellt eine ideale Plattform dar, um die Grundlagen der Spielentwicklung und der Programmierung zu erlernen.

#### Teilnahme und Weiterentwicklung

Das Projekt ist offen und jeder ist eingeladen, daran teilzunehmen. Ob Anfänger oder Fortgeschrittener, jeder kann zum Projekt beitragen, neue Ideen einbringen und das Spiel weiterentwickeln. Das Ziel ist es, ein gemeinschaftliches Lernumfeld zu schaffen, in dem Wissen frei geteilt und angewendet wird.

---

## Technische Details

### Sprite Image

Das Sprite Image ist ein Image aus 5 Spalten x 4 Reihen mit 64px x 64p x Sprite Images.

<img src="./assets/images/snake-sprite.png" width="200" alt="sprite image">

Quelle: Sprit Image __`rembound / Snake-Game-HTML5`__

Mit diesen Indizes wird der Schlangen Teil aus dem Sprite geladen.

    [3, 0]: Kopf nach oben
    [4, 0]: Kopf nach rechts
    [3, 1]: Kopf nach links
    [4, 1]: Kopf nach unten
    [1, 0]: Gerade horizontale Linie
    [2, 0]: Rechtskurve von Horizontal zu Vertikal (links nach unten)
    [2, 1]: Gerade vertikale Linie
    [2, 2]: Linkskurve von Vertikal zu Horizontal (oben nach links)
    [0, 1]: Linkskurve von Horizontal zu Vertikal (rechts nach oben)
    [0, 0]: Rechtskurve von Vertikal zu Horizontal (unten nach rechts)
    

Am Beispiel des Schlangen Kopfes, wird gezeigt wie die Sprite Images auf das Canvas gezeichnet werden.

```javascript
context.drawImage(tileImage, tx * 64, ty * 64, 64, 64, tilex, tiley, level.tilewidth, level.tileheight);
```

1. **Segment finden**: Der Kopf der Schlange ist immer das erste Segment in der `snake.segments`-Liste. Wir holen uns seine Koordinaten `segx` und `segy`.

2. **Kopf-Position bestimmen**: 
   - `tilex` und `tiley` berechnen die Position des Kopfes auf dem Canvas. Dies geschieht durch Multiplizieren der Segment-Koordinaten (`segx` und `segy`) mit der Breite und Höhe einer Kachel (`level.tilewidth` und `level.tileheight`).
   - Beispiel: Wenn der Kopf an Position (2, 3) ist und jede Kachel 36 Pixel groß ist, dann ist `tilex = 2 * 36 = 72` und `tiley = 3 * 36 = 108`.

3. **Aussehen des Kopfes festlegen**:
   - `tx` und `ty` bestimmen, welcher Teil des Bildes `tileImage` als Kopf der Schlange verwendet wird. Dies hängt davon ab, in welche Richtung die Schlange schaut (oben, rechts, unten, links).
   - Beispiel: Wenn die Schlange nach oben schaut, könnte `tx = 3` und `ty = 0` sein.

4. **Kopf zeichnen**:
   - `context.drawImage(tileImage, tx * 64, ty * 64, 64, 64, tilex, tiley, level.tilewidth, level.tileheight)`:
     - `tileImage` ist das Bild, das verschiedene Teile der Schlange enthält.
     - `tx * 64` und `ty * 64` legen die Position des Kopfes im Bild fest.
     - `64, 64` ist die Größe des Kopfes im Bild.
     - `tilex` und `tiley` sind die Positionen auf dem Canvas, wo der Kopf gezeichnet wird.
     - `level.tilewidth` und `level.tileheight` bestimmen die Größe, in der der Kopf auf dem Canvas gezeichnet wird.

- Der Kopf der Schlange wird gezeichnet, indem die Position des ersten Segments der Schlange bestimmt wird.
- Abhängig von der Richtung der Schlange wird der richtige Teil des Bildes (`tileImage`) ausgewählt.
- Dieser Teil des Bildes wird an der berechneten Position auf dem Canvas gezeichnet.
