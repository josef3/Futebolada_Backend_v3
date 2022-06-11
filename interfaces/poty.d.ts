import IPlayer from './player';
//----------------------------------------------------------

export default interface IPOTY {
	id_poty: number;
	id_year: number;
	id_player: number;
}

export type IPOTYPlayer = IPOTY &
	Pick<IPlayer, 'first_name' | 'last_name' | 'avatar_url' | 'no_bg_avatar_url'>;
