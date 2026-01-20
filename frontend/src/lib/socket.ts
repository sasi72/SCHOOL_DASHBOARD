import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

class SocketServices {
    private socket: Socket | null = null;

    connect(): Socket {
        if(!this.socket) {
            this.socket = io(SOCKET_URL, {
                transports: ['websockets'],
                autoConnect: true,
            });
            
            this.socket.on('connect', ()=> {
                console.log('Socket connected:', this.socket?.id);
            });

            this.socket.on('disconnect', ()=>{
                console.log('Socket disconneted');
            });

            this.socket.on('connect_error',(error)=>{
                console.log('Socket connection error:', error);
            });

        }
        return this.socket;
    }

    disconnect(): void {
        if(this.socket){
            this.socket.disconnect();
            this.socket = null;
        }
    }

    getSocket(): Socket | null {
        return this.socket;
    }

    on(event: string, callback: (...args: any[]) => void): void {
        this.socket?.on(event,callback);
    }

    off(event: string, callback?: (...args: any[]) => void): void {
        this.socket?.off(event,callback);
    }

    emit(event: string, data?: any): void {
        this.socket?.emit(event, data);
    }
}

export default new SocketServices();