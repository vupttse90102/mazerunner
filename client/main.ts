import { Maze, Point, EColor } from "./maze";

module MazeRunner {
    interface TemplateMazeInstance extends Blaze.TemplateInstance {
        maze: ReactiveVar<Maze>;
    }

    function initMaze(): Maze {
        // number of color should be less than 8 (Only 8 colors supported for now);
        // consider set a reasonable maze size
        return new Maze(40, 40, 3); 
    }

    Template.templateMazeRunner.onCreated(function(this: TemplateMazeInstance): void {
        this.maze = new ReactiveVar(initMaze());
    });

    Template.templateMazeRunner.helpers({
        maze: function(): Maze {
            let instance = <TemplateMazeInstance>Template.instance();
            return instance.maze.get();
        },
    });

    Template.templateMazeRunner.events({
        "click .js-solve": function(event: any, tpl: TemplateMazeInstance): void {
            let maze = tpl.maze.get();
            maze.solve();
            tpl.maze.set(maze);
        },
        "click .js-reset": function(event: any, tpl: TemplateMazeInstance): void {
            tpl.maze.set(initMaze());
        },
    });

    Template.templateMaze.helpers({
        rows: function(this: Maze): Point[][] {
            let rows = [];
            let points = [...this.points];
            while(points.length)
                rows.push(points.splice(0, this.width));

            return rows;
        },
    });

    Template.templatePoint.helpers({
        modClass: function(this: Point): string {
            return "mod-" + EColor[this.color].toLowerCase();
        },
    });
}