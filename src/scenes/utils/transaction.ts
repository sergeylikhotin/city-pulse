import {
  BankAccountTransactionType,
  PlayerBankAccountTransaction,
} from '@prisma/client';

export const types: Record<
  BankAccountTransactionType,
  { text: string; action: string }
> = {
  DEPOSIT: { text: 'Вклад', action: 'Перевод на счет бизнеса:' },
  PAYMENT: { text: 'Платеж', action: 'Оплата по контракту:' },
  WITHDRAWAL: { text: 'Снятие', action: 'Перевод на личный счет:' },
  TRANSFER: { text: 'Перевод', action: 'Между счетами:' },
};

export const format = (transaction: PlayerBankAccountTransaction): string => {
  const type = types[transaction.type];

  return `${transaction.createdAt} - ${type.text} - ${type.action} ${transaction.amount}`;
};
