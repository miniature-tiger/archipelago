# Archipelago - A seafaring and trading turn-based strategy game.

### What is the Project About?
Archipelago is a seafaring and trading turn-based strategy game. Players guide their ships around the islands, searching for goods, building ships, trading with the Kingdom settlements and avoiding being chased down by pirates. 

### Development overview
The basic game mechanics are largely complete, although there are a few more details to be added (see phase 7 of roadmap).
Currently I'm working on a one-player version of the game against three computer opponents.
A multi-player version is also planned once the one-player version is complete. 

### Technology Stack
Browser-based. 
Mechanics: Javascript.
Visuals: CSS initially but now moved across to Canvas and SVG.

### Where to play!
The game can currently be found here:
https://miniature-tiger.github.io/archipelago/

----------------------------------------------

# Installation

### To install locally
1) Download all files to your local computer using the "Clone of download" ---> "Download ZIP" buttons on the archipelago repository of github.
2) Move downloaded files to the folder of your choice.
3) Open the index.html file using your preferred browser (production testing is in safari and chrome).

----------------------------------------------

# Road map (short term):

### Phase 1 - Board and ship movement: COMPLETE
* Board set up - COMPLETE
* Basic ship creation: functionality and graphics  - COMPLETE 
* Manual ship movement and board updating  - COMPLETE
* Basic compass creation: functionality and graphics - COMPLETE
* Turn based activity of ship movement - COMPLETE
* Logic of length of longer moves around obstacles - COMPLETE
* Chaining together transitions to allow graphics of longer moves - COMPLETE
* Separation of board layers (Canvas base layer, Canvas activation layer overlay, SVG piece overlays) - COMPLETE

### Phase 2 - Resources, Goods, Building and Trade Contracts: COMPLETE 

Resources
* Add Resource tiles - COMPLETE
* Discovery of resource tiles - COMPLETE
* Claiming of resource tiles - COMPLETE
* Dashboard of player pieces - COMPLETE

Goods
* Creation of new goods each turn - COMPLETE
* Loading, unloading and transportation of goods - COMPLETE
* Dashboard of goods pieces - COMPLETE
* Goods icons - COMPLETE
* Variable quantity of goods to be loaded / unloaded - COMPLETE

Contracts for delivery:
* Semi-random (equitable) generation of trade delivery contracts - COMPLETE
* Creation of trade settlements - COMPLETE
* Dashboard for contracts - COMPLETE
* Mechanics for contract sign-up - COMPLETE
* Mechanics for contract delivery - COMPLETE
* Island naming: for describing location of trading settlements - COMPLETE
* Graphics of trade routes - COMPLETE
* Continuance of contracts over time - COMPLETE
* Breaking of contracts due to interference - COMPLETE
* Re-work resource and contract surrounds to prevent overrun - COMPLETE
* Only allow one contract to be made with each island - COMPLETE

Building:
* New ship designs - Catamaran, warship, cargo ship - COMPLETE
* Definition of goods requirements to build each ship and ship ability specifications - COMPLETE
* Ability to construct new ships - COMPLETE

Scoring: 
* Work out scoring mechanism - COMPLETE
* Add score dashboard - COMPLETE
* Breaking of game into stages - COMPLETE
* Reduction in players as time passes - COMPLETE
* Game ending - time limit of eight moons and completing contracts with all four islands - COMPLETE

### Phase 3 - Conflicts: COMPLETE

Pirates:
* Add pirate ships - COMPLETE
* Automate pirate ship movements (basic movement with wind and search for cargo ships) - COMPLETE
* Search - telescope range of 5 tiles for stronger search for ships - COMPLETE
* Separate ship types for teams - COMPLETE

Forts:
* Add fort icons - COMPLETE
* Create safe harbour from pirate ships - COMPLETE

Conflicts:
* Attack - Develop conflict method between ships - COMPLETE
* Stealing of cargo - COMPLETE
* Limping back to harbour - COMPLETE
* Ship repair - COMPLETE

### Phase 4 - One player version development
Surround, dashboards, commentary:
* Keep dashboards fixed on one player with option to switch to other teams
* Change commentary to focus on single player - with updates on other team moves

Resource tile search phase:
* Get all ships moving - COMPLETE
* Automate search for resource tiles - COMPLETE
* Automate claiming of resource tiles - COMPLETE

Conflicts:
* Automate avoidance of pirate ships - COMPLETE
* Automate ship return to nearest harbour after damage taken - COMPLETE

Contracts for delivery:
* Automate collection of goods - COMPLETE
* Automate delivery of goods - COMPLETE
* Automate choice of contracts to fulfil - COMPLETE

Shipbuilding
* Automate decision to build ships - COMPLETE

Strategies and AI for computer players
* Produce array of ships with game strategies 
* Decision making between different possibilities - BASICS COMPLETE
* Automate teamworking so that ships on same team do not pursue same targets - COMPLETE
* Consider different ability levels and strategy types for computer players - IN PROGRESS

### Phase 5 - Game Management and Settings 
Settings
* Settings pop up created - COMPLETE
* Local options (choose team colour, player name etc)
* Options added - In progress - game speed added, developer tools added
* Game saving
* Game rewind / replay

### Phase 6 - Rules, roll-out, documentation, testing etc
* TBDeveloped

### Phase 7 - Additional game features  
* Kingdom tax collection ship
* Develop central market allowing players without resources to trade and fulfill contracts
* Whirlpools

### Phase 8 - Multi-player version
* TBDeveloped

----------------------------------------------



































































































































































































