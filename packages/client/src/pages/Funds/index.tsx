import React, { useState, useEffect } from "react";
import { Card, Modal, Button } from "react-bootstrap";
import { useModal } from "react-modal-hook";
import { IGameStatePlayer, GameEntity, GameEvent } from "@monopoly-money/game-state";
import SendMoneyModal from "./SendMoneyModal";
import GameCode from "./GameCode";
import { formatCurrency, sortPlayersByName } from "../../utils";
import { bankName, freeParkingName, shenanigansName, diceName } from "../../constants";
import PlayerCard from "./PlayerCard";
import "./Funds.scss";
import RecentTransactions from "./RecentTransactions";

interface IFundsProps {
  gameId: string;
  playerId: string;
  isGameOpen: boolean;
  players: IGameStatePlayer[];
  useFreeParking: boolean;
  freeParkingBalance: number;
  proposeTransaction: (from: GameEntity, to: GameEntity, amount: number) => void;
  events: GameEvent[];
}

const Funds: React.FC<IFundsProps> = ({
  gameId,
  playerId,
  isGameOpen,
  players,
  useFreeParking,
  freeParkingBalance,
  proposeTransaction,
  events
}) => {
  const [recipient, setRecipient] = useState<IGameStatePlayer | "freeParking" | "bank" | null>(
    null
  );
  const [diceRoll, setDiceRoll] = useState<string | null>(null);
  const [showSendMoneyModal, hideSendMoneyModal] = useModal(
    () => (
      <>
        {recipient !== null && (
          <SendMoneyModal
            balance={me?.balance ?? 0}
            playerId={playerId}
            recipient={recipient}
            proposeTransaction={proposeTransaction}
            onClose={() => setRecipient(null)}
          />
        )}
      </>
    ),
    [recipient]
  );
  const [tax, setTax] = useState<number | null>(null);
  const [showTaxModal, hideTaxModal] = useModal(
    () => (
      <>
        {tax !== null && (
          <Modal show={true} onHide={() => setTax(null)} size="lg" centered className="send-money-modal">
            <Modal.Header closeButton>
              <Modal.Title>Transfer Funds</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <p className="text-center">💵 → {bankName}</p>
              <p className="text-center">{formatCurrency(tax)}</p>
              <Button block variant="success" className="mt-1" onClick={() => {
                proposeTransaction(playerId, "bank", tax);
                setTax(null);}}>

                Send
              </Button>
            </Modal.Body>
          </Modal>
        )}
      </>
    ),
    [tax]
  );

  // Show/hide the send money modal automatically
  useEffect(() => {
    if (recipient !== null) {
      showSendMoneyModal();
    } else {
      hideSendMoneyModal();
    }
  }, [recipient, showSendMoneyModal, hideSendMoneyModal]);

  // Show/hide the tax modal automatically
  useEffect(() => {
    if (tax !== null) {
      showTaxModal();
    } else {
      hideTaxModal();
    }
  }, [tax, showTaxModal, hideTaxModal]);

  const me = players.find((p) => p.playerId === playerId);
  const isBanker = me?.banker ?? false;

  return (
    <div className="funds">
      {isGameOpen && <GameCode gameId={gameId} isBanker={isBanker} />}

      <Card className="mb-1 text-center">
        {me !== undefined && (
          <Card.Body className="p-3">
            {me.name}: {formatCurrency(me.balance)}
          </Card.Body>
        )}
      </Card>

      <div className="mb-1 balance-grid">
        {sortPlayersByName(players.filter((p) => p.playerId !== playerId)).map((player) => (
          <PlayerCard
            key={player.playerId}
            name={player.name}
            connected={player.connected}
            balance={player.balance}
            onClick={() => setRecipient(player)}
          />
        ))}
      </div>

      <div className="mb-1 balance-grid">
        {useFreeParking &&
        <PlayerCard
          name={freeParkingName}
          connected={null}
          balance={freeParkingBalance}
          onClick={() => setRecipient("freeParking")}
        />
        }
        <PlayerCard
          name={bankName}
          connected={null}
          balance={Number.POSITIVE_INFINITY}
          onClick={() => setRecipient("bank")}
        />
        {me !== undefined && (
        <PlayerCard
          name={shenanigansName}
          connected={null}
          balance={Math.floor(me.balance * 0.25)}
          onClick={() => setTax(Math.floor(me.balance * 0.25))}
        />
        )}
      </div>

      <Card className="mb-1 text-center">
        <Card.Body className="p-3" onClick={() => setDiceRoll(
          (1 + Math.floor(Math.random() * 6)).toString()
          + " , "
          + (1 + Math.floor(Math.random() * 6)).toString())}>

          <div>{diceName}</div>
          {diceRoll !== null && (<div>{diceRoll}</div>)}
        </Card.Body>
      </Card>

      <div className="mt-2">
        <RecentTransactions events={events} players={players} />
      </div>
    </div>
  );
};

export default Funds;
