import type { Program } from '@coral-xyz/anchor';
import * as anchor from '@coral-xyz/anchor';
import { expect } from 'chai';
import type { Vault } from '../target/types/vault';

describe('vault', () => {
	// Configure the client to use the local cluster.
	const provider = anchor.AnchorProvider.env();
	anchor.setProvider(provider);

	const user = provider.wallet.publicKey;

	const program = anchor.workspace.vault as Program<Vault>;

	const vaultState = anchor.web3.PublicKey.findProgramAddressSync(
		[Buffer.from('state'), provider.publicKey.toBytes()],
		program.programId,
	)[0];

	const vault = anchor.web3.PublicKey.findProgramAddressSync(
		[Buffer.from('vault'), vaultState.toBytes()],
		program.programId,
	)[0];

	it('User have SOL', async () => {
		const balance = await provider.connection.getBalance(user);
		console.log(balance);
		expect(balance).to.be.greaterThan(0);
	});

	it('Is initialized!', async () => {
		const tx = await program.methods
			.initialize()
			.accountsPartial({
				user,
				vault,
				vaultState,
				systemProgram: anchor.web3.SystemProgram.programId,
			})
			.rpc();

		console.log('Your transaction signature', tx);
		console.log(
			'Vault account info:',
			await provider.connection.getAccountInfo(vault),
		);
	});

	it('Can deposit 2 SOL', async () => {
		const tx = await program.methods
			.deposit(new anchor.BN(2 * anchor.web3.LAMPORTS_PER_SOL))
			.accountsPartial({
				user,
				vault,
				vaultState,
				systemProgram: anchor.web3.SystemProgram.programId,
			})
			.rpc();

		console.log('Your transaction signature', tx);
		console.log(
			'Vault account info:',
			await provider.connection.getAccountInfo(vault),
		);
		console.log(
			'Vault account info:',
			(await provider.connection.getBalance(vault)).toString(),
		);
	});

	it('Can withdraw 1 SOL', async () => {
		const tx = await program.methods
			.withdraw(new anchor.BN(1 * anchor.web3.LAMPORTS_PER_SOL))
			.accountsPartial({
				user,
				vault,
				vaultState,
				systemProgram: anchor.web3.SystemProgram.programId,
			})
			.rpc();

		console.log('Your transaction signature', tx);
		console.log(
			'Vault account info:',
			await provider.connection.getAccountInfo(vault),
		);
		console.log(
			'Vault account info:',
			(await provider.connection.getBalance(vault)).toString(),
		);
	});

	it('Can close vault', async () => {
		const tx = await program.methods
			.close()
			.accountsPartial({
				user,
				vault,
				vaultState,
				systemProgram: anchor.web3.SystemProgram.programId,
			})
			.rpc();

		console.log('Your transaction signature', tx);
		console.log(
			'Vault account info:',
			await provider.connection.getAccountInfo(vault),
		);
	});
});
