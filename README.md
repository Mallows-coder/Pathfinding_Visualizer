**PATHFINDING VISUALIZER**

<img width="1918" height="1037" alt="image" src="https://github.com/user-attachments/assets/cf99caa3-376b-46b5-a8ef-bc811674df53" />
<img width="1915" height="1035" alt="image" src="https://github.com/user-attachments/assets/d73bd18e-09aa-4aec-94ce-8513ccb6ace9" />

Hi! and welcome to my Pathfinding Visualizer project.

This project let's you visualize how different algorithms (BFS, DFS, Dijksta, and A*) work in finding the shortest path in a maze.

**HOW TO GET STARTED**
1. Create a folder (you can name it with whatever you want)
2. Download all of the files present in this repository
3. Make sure that you have live server downloaded in your VS Code extension
4. Go to your index.html and click Live Server

**Selection, Buttons, and Utility Icon**
This section serves as the main control hub for the visualizer, allowing users to fully customize the grid environment, select their desired algorithms, and control the pace of the application. 

**Selections (Dropdown Menus)**
1. Algorithms: Choose the pathfinding algorithm to execute, including Breadth-First Search, Depth-First Search, Dijkstra's Algorithm, and A* Search.
2. Maze Generation: Select a procedural generation method to automatically build complex wall patterns, such as Recursive Backtracking, Recursive Division, Randomized Prim's, or Random Wall Scatter.
3. Maze & Algorithm Speed: Adjust the animation speed of the visualizer to Slow, Average, or Fast to closely observe how the algorithms evaluate nodes.

**Action Buttons**
1. Generate Maze: Triggers your selected maze generation algorithm to draw obstacles onto the grid.
2. Visualize: Starts the real-time animation of the selected pathfinding algorithm.
3. Clear Path: Removes the visualization colors (visited nodes and the shortest path) while keeping your drawn walls intact, allowing you to easily race a different algorithm on the exact same maze.
4. Clear Board: Completely resets the entire grid back to a blank slate.

**Utility Icons**
1. Settings (Gear): Opens a configuration modal where you can manually adjust the grid dimensions (Rows: 10-40, Columns: 10-60) and precisely set the starting coordinates for both the Start and Target nodes.
2. Theme: Toggles the application interface between light mode and a custom dark mode.
3. GitHub: Links directly to github.com

**RECOMMENDATION AND IMPROVEMENT**
1. Code a responsive layout
2. Add additional algorithms and maze generation
