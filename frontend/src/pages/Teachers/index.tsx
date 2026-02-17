import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Mail, Phone, Filter} from 'lucide-react';
import api from '../../lib/axios';
import toast from 'react-hot-toast';
import { Teachers, Subjects, Class } from '../../types';
