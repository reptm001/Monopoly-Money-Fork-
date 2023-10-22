import React, { useState } from "react";
import { Button, DropdownButton, Dropdown, ButtonGroup } from "react-bootstrap";
import { IGameStatePlayer } from "@monopoly-money/game-state";
import { formatCurrency } from "../../utils";

interface IGiveFreeParkingProps {
  players: IGameStatePlayer[];
  freeParkingBalance: number;
  onSubmit: (playerId: string, multiplier: number) => void;
}

const GiveFreeParking: React.FC<IGiveFreeParkingProps> = ({
  players,
  freeParkingBalance,
  onSubmit
}) => {
  const [selectedPlayer, setSelectedPlayer] = useState<IGameStatePlayer | null>(null);
  const [selectedMultiplier, setSelectedMultiplier] = useState<number | null>(null);

  const valid = (selectedPlayer !== null) && (selectedMultiplier !== null);

  const submit = () => {
    if ((selectedPlayer !== null) && (selectedMultiplier !== null)) {
      onSubmit(selectedPlayer.playerId, selectedMultiplier);
      setSelectedPlayer(null);
      setSelectedMultiplier(null);
    }
  };

  return (
    <>
      <label htmlFor="free-parking-player" className="mb-1">
        Give Student Finance ({formatCurrency(freeParkingBalance)})
      </label>

      <ButtonGroup className="mt-1 player-and-submit-group">
        <DropdownButton
          as={ButtonGroup}
          variant="outline-secondary"
          id="free-parking-player"
          title={selectedPlayer?.name ?? "Select Player"}
        >
          {players.map((player) => (
            <Dropdown.Item key={player.playerId} onClick={() => setSelectedPlayer(player)}>
              {player.name}
            </Dropdown.Item>
          ))}
        </DropdownButton>

        <DropdownButton
          as={ButtonGroup}
          variant="outline-secondary"
          id="free-parking-multiplier"
          title={selectedMultiplier ?? "Select Multiplier"}
        >
          <Dropdown.Item onClick={() => setSelectedMultiplier(1)}>
            x1
          </Dropdown.Item>
          <Dropdown.Item onClick={() => setSelectedMultiplier(0.9)}>
            x0.9
          </Dropdown.Item>
        </DropdownButton>

        <Button variant="outline-secondary" onClick={submit} disabled={!valid}>
          Give
        </Button>
      </ButtonGroup>
    </>
  );
};

export default GiveFreeParking;
