import React, {useState, useEffect} from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import {Student, Class} from '../../types';