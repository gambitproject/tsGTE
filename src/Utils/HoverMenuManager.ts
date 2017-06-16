/// <reference path = "../../lib/phaser.d.ts"/>"/>
///<reference path="../Controller/UserActionController.ts"/>
///<reference path="../View/NodeView.ts"/>
///<reference path="../View/ISetView.ts"/>
///<reference path="HoverButton.ts"/>

// add, remove, link, unlink, cut, players
module GTE {

    export class HoverMenuManager {
        game: Phaser.Game;
        userActionController: UserActionController;

        plusButton: HoverButton;
        minusButton: HoverButton;
        linkButton: HoverButton;
        unlinkButton: HoverButton;
        cutButton: HoverButton;
        player1Button: HoverButton;
        player2Button: HoverButton;
        player3Button: HoverButton;
        player4Button: HoverButton;

        buttonsGroup: Phaser.Group;
        buttonsArray: Array<HoverButton>;
        menuTween: Phaser.Tween;
        private previouslyHoveredSprite: Phaser.Sprite;
        selectedNodesSprites: Array<NodeView>;

        constructor(game: Phaser.Game, userActionController: UserActionController) {
            this.game = game;
            this.userActionController = userActionController;

            this.buttonsGroup = this.game.add.group();
            this.createButtonSprites();
            this.setButtonFunctionality();
            this.buttonsGroup.position.set(this.game.width / 2, this.game.height / 2);
            let nodeWidth = this.userActionController.treeController.treeView.nodes[0].width;

            this.repositionButtonSprites(nodeWidth);

            this.menuTween = this.game.add.tween(this.buttonsGroup);
            this.buttonsGroup.alpha = 0;

            this.userActionController.treeController.hoverSignal.add(function () {
                let nodeV = <NodeView>arguments[0];
                this.triggerMenu(nodeV);
            }, this);

            this.selectedNodesSprites = this.userActionController.treeController.selectedNodes;
        }

        private createButtonSprites() {
            this.plusButton = new HoverButton(this.game, this.buttonsGroup, "plus", PLUS_BUTTON_COLOR);
            this.minusButton = new HoverButton(this.game, this.buttonsGroup, "minus", MINUS_BUTTON_COLOR);
            this.linkButton = new HoverButton(this.game, this.buttonsGroup, "link", LINK_BUTTON_COLOR);
            this.unlinkButton = new HoverButton(this.game, this.buttonsGroup, "unlink", UNLINK_BUTTON_COLOR);
            this.cutButton = new HoverButton(this.game, this.buttonsGroup, "scissors", CUT_BUTTON_COLOR);
            this.player1Button = new HoverButton(this.game, this.buttonsGroup, "player", PLAYER_BUTTON_COLOR, PLAYER_COLORS[0]);
            this.player2Button = new HoverButton(this.game, this.buttonsGroup, "player", PLAYER_BUTTON_COLOR, PLAYER_COLORS[1]);
            this.player3Button = new HoverButton(this.game, this.buttonsGroup, "player", PLAYER_BUTTON_COLOR, PLAYER_COLORS[2]);
            this.player4Button = new HoverButton(this.game, this.buttonsGroup, "player", PLAYER_BUTTON_COLOR, PLAYER_COLORS[3]);

            this.buttonsArray = [this.plusButton, this.minusButton, this.linkButton, this.unlinkButton,
                this.cutButton, this.player1Button, this.player2Button, this.player3Button, this.player4Button];
        }

        private setButtonFunctionality() {
            // Add node button functionality
            this.plusButton.events.onInputDown.add(() => {
                if (this.previouslyHoveredSprite instanceof NodeView && this.selectedNodesSprites.length !== 0) {
                    this.userActionController.addNodesHandler();
                }
                else if (this.previouslyHoveredSprite instanceof NodeView && this.selectedNodesSprites.length === 0) {
                    this.userActionController.addNodesHandler(this.previouslyHoveredSprite);
                }
                this.buttonsGroup.alpha = 0;
                this.previouslyHoveredSprite = null;
            });

            // Remove node button functionality
            this.minusButton.events.onInputDown.add(() => {
                if (this.previouslyHoveredSprite instanceof NodeView && this.selectedNodesSprites.length !== 0) {
                    this.userActionController.deleteNodeHandler();
                }
                else if(this.previouslyHoveredSprite instanceof NodeView && this.selectedNodesSprites.length ===0){
                    this.userActionController.deleteNodeHandler(this.previouslyHoveredSprite);
                }
                this.buttonsGroup.alpha = 0;
                this.previouslyHoveredSprite = null;
            });

            // Players button functionality
            let playerButtons = [];
            this.buttonsArray.forEach((btn:HoverButton)=>{
                if(btn.buttonKey==="player"){
                    playerButtons.push(btn);
                }
            });

            playerButtons.forEach((btn:Phaser.Sprite)=>{
               btn.events.onInputDown.add(()=>{
                   if (this.previouslyHoveredSprite instanceof NodeView && this.selectedNodesSprites.length !== 0) {
                       this.userActionController.assignPlayerToNodeHandler(playerButtons.indexOf(btn)+1);
                   }
                   else if(this.previouslyHoveredSprite instanceof NodeView && this.selectedNodesSprites.length ===0){
                       this.userActionController.assignPlayerToNodeHandler(playerButtons.indexOf(btn)+1,this.previouslyHoveredSprite);
                   }
                   this.buttonsGroup.alpha = 0;
                   this.previouslyHoveredSprite = null;
               });
            });

            // Information sets functionality
            this.linkButton.events.onInputDown.add(()=>{
               this.userActionController.createISetHandler();
                this.buttonsGroup.alpha = 0;
                this.previouslyHoveredSprite = null;
            });
        }

        private repositionButtonSprites(width: number) {
            let buttonsScale = width * 0.001;
            this.buttonsGroup.scale.set(buttonsScale);
            let buttonWidth = 320;
            this.plusButton.position.set(-0.5 * buttonWidth, 0);
            this.minusButton.position.set(0.5 * buttonWidth, 0);
            this.player1Button.position.set(-1.5 * buttonWidth, buttonWidth);
            this.player2Button.position.set(-0.5 * buttonWidth, buttonWidth);
            this.player3Button.position.set(0.5 * buttonWidth, buttonWidth);
            this.player4Button.position.set(1.5 * buttonWidth, buttonWidth);

            this.unlinkButton.position.set(0, 2 * buttonWidth);
            this.linkButton.position.set(-buttonWidth, 2 * buttonWidth);
            this.cutButton.position.set(buttonWidth, 2 * buttonWidth);
        }

        triggerMenu(hoveredElement: Phaser.Sprite) {
            this.game.world.bringToTop(this.buttonsGroup);
            if (this.previouslyHoveredSprite !== hoveredElement) {
                if (this.buttonsGroup.alpha !== 0) {
                    this.buttonsGroup.alpha = 0;
                    this.menuTween.stop();
                }
                this.previouslyHoveredSprite = hoveredElement;
                this.handleMenuCases(hoveredElement);
            }
        }

        private handleMenuCases(hoveredSprite: Phaser.Sprite) {
            this.buttonsGroup.x = hoveredSprite.x;
            this.buttonsGroup.y = hoveredSprite.y;


            this.buttonsArray.forEach((button: HoverButton) => button.setActive());
            //If only one node sprite is selected and hovered

            //Case 1: The hovered sprite is a node
            if (hoveredSprite instanceof NodeView) {
                //Case 1.1: There is no multiple selection of nodes
                if (this.selectedNodesSprites.length <= 1) {
                    this.unlinkButton.setHidden();
                    this.linkButton.setHidden();
                    this.cutButton.setHidden();
                }
                //Case 1.2: If the hovered sprite is not among the selected sprites
                else if (this.selectedNodesSprites.length > 1 && this.selectedNodesSprites.indexOf(hoveredSprite) === -1) {
                    return;
                }
                //Case 1.3: If the hovered sprite is among the selected sprites
                else if (this.selectedNodesSprites.length > 1) {
                    // Check whether we can create an information set and disable the corresponding button
                    let selectedNodes = [];
                    let differentISets = [];
                    this.selectedNodesSprites.forEach((s: NodeView) => {
                        selectedNodes.push(s.node);
                        if (s.node.iSet && differentISets.indexOf(s.node.iSet) === -1) {
                            differentISets.push(s.node.iSet);
                        }
                    });
                    try {
                        this.userActionController.treeController.tree.canCreateISet(selectedNodes);
                    }
                    catch (err) {
                        this.linkButton.setInactive();
                    }
                    //Check whether all nodes are in different sets to disable unlink button
                    console.log(differentISets.length);
                    if (differentISets.length !== 1) {
                        this.unlinkButton.setInactive();
                    }
                    else {
                        this.linkButton.setInactive();
                    }
                    //TODO: Add cut logic here - will be done at a later stage!
                }
            }
            this.menuTween = this.game.add.tween(this.buttonsGroup).to({
                y: this.buttonsGroup.position.y + 50,
                alpha: 1
            }, 300, Phaser.Easing.Default, true);
        }
    }
}